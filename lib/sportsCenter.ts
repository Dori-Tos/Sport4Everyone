import { z } from "zod";
import { sportFieldSchema } from "./sportFields";

export const sportsCenterSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    location: z.string(),
    sportFields: z.array(sportFieldSchema),
    attendance: z.number(),
})

export type SportsCenter = z.infer<typeof sportsCenterSchema>;

export async function getSportFields() {
    const res = await fetch("http://localhost:3000/api/sportscenters");
    return (await res.json()) as SportsCenter[];
}

export async function addSportField(sportsCenter: SportsCenter) {
    sportsCenter = sportsCenterSchema.parse(sportsCenter);

    const formData = new URLSearchParams();
    formData.append("name", sportsCenter.name);
    formData.append("location", JSON.stringify(sportsCenter.location));
    formData.append("sportFields", JSON.stringify(sportsCenter.sportFields));
    formData.append("attendance", JSON.stringify(sportsCenter.attendance));

    const res = await fetch("http://localhost:3000/api/sportscenters", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });
    return (await res.json()) as SportsCenter;
}

export async function deleteSportField(id: string) {
    const formData = new URLSearchParams();
    formData.append("id", String(id));

    const res = await fetch(`http://localhost:3000/api/sportscenters/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
    }); 
    return (await res.json()) as SportsCenter;
}