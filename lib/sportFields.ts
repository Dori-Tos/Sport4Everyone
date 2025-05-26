import { z } from "zod";
import { sportSchema } from "./sports";

export const sportFieldSchema = z.object({
    name: z.string(),
    sports: z.array(z.number()),
    price: z.coerce.number(),
})

export const sportFieldSchemaWithId = z.object({
    id: z.coerce.number(),
    name: z.coerce.string(),
    price: z.coerce.number(),
    sportsCenterId: z.coerce.number(),
    sports: z.array(sportSchema),
})

export type SportField = z.infer<typeof sportFieldSchema>;
export type CompleteSportField = z.infer<typeof sportFieldSchemaWithId>;

export async function getSportFields() {
    const res = await fetch("http://localhost:3000/api/sportfields");
    return (await res.json()) as SportField[];
}

export async function getSportFieldsBySportsCenter(sportsCenterId: Number) {
    try {
        const res = await fetch(`http://localhost:3000/api/sportfields/getBySportsCenter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sportsCenterId: sportsCenterId }),
        });
        return (await res.json()) as CompleteSportField[];

    } catch (error) {
        console.error("Error fetching sport fields by sports center:", error);
        throw error;
    }
}

export async function addSportField(sportField: SportField, sportsCenterId: number) {
    try {
        sportField = sportFieldSchema.parse(sportField);

        const res = await fetch("http://localhost:3000/api/sportfields/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify({
                sportFieldName: sportField.name,
                sportFieldSports: JSON.stringify(sportField.sports),
                sportFieldPrice: String(sportField.price),
                sportsCenterId: String(sportsCenterId),
            }),
        });
        if (!res.ok) {
            throw new Error(`Error adding sport field: ${res.statusText}`);
        }
        return (await res.json()) as SportField;
    } catch (error) {
        console.error("Error adding sport field:", error);
        throw error;
    }
}

export async function removeSportField(id: string) {
    const formData = new URLSearchParams();
    formData.append("id", String(id));

    const res = await fetch(`http://localhost:3000/api/sportfields/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
    }); 
    return (await res.json()) as SportField;
}