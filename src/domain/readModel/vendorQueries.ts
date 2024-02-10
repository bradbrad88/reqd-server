import { Prisma } from "@prisma/client";
import client from "../../../config/db";
import { SupplyDetailsJson } from "../orders/Order";

type Filters = {
  query?: string;
};

type GlobalVendorsReturn = {
  id: string;
  vendorName: string;
  isPreferred: boolean;
};

export const getGlobalVendors = async (venueId: string, filters?: Filters) => {
  if (filters) {
    const sql = Prisma.sql`
  select
    id,
    vendor_name as "vendorName",
    p.vendor_id is not null as "isPreferred"
  from vendors as v left join (
    select
      vendor_id
    from preferred_vendors
    where venue_id=${venueId}::uuid
  ) as p on v.id = p.vendor_id
  where v.vendor_name ilike ${`%${filters.query || ""}%`}`;
    const res = await client.$queryRaw(sql);
    return res as GlobalVendorsReturn;
  } else {
    const sql = Prisma.sql`
  select
    id,
    vendor_name as "vendorName",
    p.vendor_id is not null as "isPreferred"
  from vendors as v left join (
    select
      vendor_id
    from preferred_vendors
    where venue_id=${venueId}::uuid
  ) as p on v.id = p.vendor_id`;
    const res = await client.$queryRaw(sql);
    return res as GlobalVendorsReturn;
  }
};

export const getSupplyDetails = async (
  vendorProductId: string
): Promise<SupplyDetailsJson> => {
  const res = await client.vendorRange.findUniqueOrThrow({
    where: { id: vendorProductId },
    include: { packageType: true },
  });
  return {
    vendorRangeId: res.id,
    vendorId: res.vendorId,
    packageQuantity: res.packageQuantity,
    packageType: res.packageType.value,
  };
};
