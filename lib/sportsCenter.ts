import { z } from "zod";
import { getSports, Sport } from "./sports";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const newSportsCenterSchema = z.object({
    name: z.string(),
    location: z.string(),
    attendance: z.coerce.number(),
    openingTime: z.string(),
    sportFields: z.array(z.coerce.number()),
})

export const sportsCenterSchema = newSportsCenterSchema.extend({
    id: z.coerce.number(),
})

export const newSportFieldSchema = z.object({
    sportFieldName: z.string(),
    sportFieldSports: z.array(z.coerce.number()),
    sportFieldPrice: z.coerce.number(),
    sportsCenterId: z.coerce.number(),
})

export type SportsCenter = z.infer<typeof sportsCenterSchema>;
export type NewSportsCenter = z.infer<typeof newSportsCenterSchema>;
export type NewSportField = z.infer<typeof newSportFieldSchema>;

export async function getSportsCenters() {
    const res = await fetch("http://localhost:3000/api/sportscenters");
    return (await res.json()) as SportsCenter[];
}

export async function getSportsCenter(id: string) {
    const res = await fetch(`http://localhost:3000/api/sportscenters/${id}`);
    return (await res.json()) as SportsCenter;
}


export async function getSportsCentersBySport(sportName: string) {
    try {
    const res = await fetch(`http://localhost:3000/api/sportscenters/getBySport`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sportName: sportName }),
    })
    return (await res.json()) as SportsCenter[];
    } catch (error) {
        console.error("Error fetching sports centers by sport:", error);
        throw error;
    }
}

export async function getSportsCentersByUserId(userId: string) {
    const users = await fetch("http://localhost:3000/api/users");
    const usersData = await users.json();
    const user = usersData.find((user: { id: string }) => user.id === userId);
    const res = user?.sportsCenters
    return (await res.json()) as SportsCenter[];
}

export async function addSportsCenter(sportsCenter: NewSportsCenter) {
    sportsCenter = newSportsCenterSchema.parse(sportsCenter);

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
    return (await res.json()) as NewSportsCenter;
}

export async function updateSportsCenter(sportsCenter: SportsCenter) {
    const formData = new URLSearchParams();
    formData.append("id", String(sportsCenter.id));
    formData.append("name", sportsCenter.name);
    formData.append("location", JSON.stringify(sportsCenter.location)); 
    formData.append("sportFields", JSON.stringify(sportsCenter.sportFields));
    formData.append("attendance", JSON.stringify(sportsCenter.attendance));
    formData.append("openingTime", JSON.stringify(sportsCenter.openingTime));

    const res = await fetch(`http://localhost:3000/api/sportscenters/${sportsCenter.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });
    return (await res.json()) as NewSportsCenter;
}

export async function addSportFieldToSportsCenter(sportField: NewSportField) {
    sportField = newSportFieldSchema.parse(sportField);

    const formData = new URLSearchParams();
    formData.append("name", sportField.sportFieldName);
    formData.append("sports", JSON.stringify(sportField.sportFieldSports));
    formData.append("price", JSON.stringify(sportField.sportFieldPrice));
    formData.append("sportsCenterId", JSON.stringify(sportField.sportsCenterId));

    await fetch("http://localhost:3000/api/sportfields", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });
    const sportsCenter = await getSportsCenter(sportField.sportsCenterId.toString());
    const updatedSportFields = sportsCenter.sportFields.concat(sportField.sportFieldSports);
    const updatedSportsCenter = { ...sportsCenter, sportFields: updatedSportFields };
    const res = updateSportsCenter(updatedSportsCenter);

    return (await res);
}

export async function removeSportsCenter(id: string) {
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