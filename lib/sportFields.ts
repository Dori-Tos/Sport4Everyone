import { z } from "zod";
import { sportSchema } from "./sports";

export const sportFieldSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    sports: z.array(sportSchema),
})

export type SportField = z.infer<typeof sportFieldSchema>;

export async function getSportFields() {
    const res = await fetch("http://localhost:3000/api/sportfields");
    return (await res.json()) as SportField[];
}

export async function addSportField(sportField: SportField) {
    sportField = sportFieldSchema.parse(sportField);

    const formData = new URLSearchParams();
    formData.append("name", sportField.name);
    formData.append("sports", JSON.stringify(sportField.sports));

    const res = await fetch("http://localhost:3000/api/sportfields", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });
    return (await res.json()) as SportField;
}

export async function deleteSportField(id: string) {
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