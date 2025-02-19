import { z } from "zod";
import { sportSchema } from "@/lib/sports";

export async function GET() {
    return Response.json(await fetch("http://193.190.63.202:/api/sports"));
}

export async function POST(request: Request) {
    let sport = sportSchema.parse(await request.json());
    return Response.json(await fetch("/api/sports", {
        method: "POST",
        body: JSON.stringify(sport),
    }));
}

export async function DELETE(request: Request) {
    let { id } = z.object({ id: z.number() }).parse(await request.json());
    return Response.json(await fetch(`/api/sports/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
    }));
}