import { z } from "zod";

export const shareLinkScope = z.object({
  symptoms: z.boolean().default(true),
  diabetes: z.boolean().default(true),
  medications: z.boolean().default(true),
  range: z
    .object({
      from: z.coerce.date(),
      to: z.coerce.date(),
    })
    .nullish(),
});

export const shareLinkCreateInput = z.object({
  scope: shareLinkScope,
  expiresAt: z.coerce.date(),
});

export type ShareLinkScope = z.infer<typeof shareLinkScope>;
export type ShareLinkCreateInput = z.infer<typeof shareLinkCreateInput>;
