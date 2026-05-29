import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import connectToDB from "@/lib/mongo.db";
import { ProjectInterface } from "@/lib/schema/project.schema";

export async function GET() {
  try {
    const db = connectToDB();

    const dummy = await (await db).collection("projects").find({}).toArray();

    return new Response(JSON.stringify(dummy), { status: 200 });
  } catch (err) {
    console.log(err);
  }
}

function slugify(str: string) {
  str = str.trim();
  str = str.toLowerCase();
  str = str.replace(/[àáäâãåā]/g, "a");
  str = str.replace(/[èéëêēėę]/g, "e");
  str = str.replace(/[ìíïîīį]/g, "i");
  str = str.replace(/[òóöôõøō]/g, "o");
  str = str.replace(/[ùúüûūų]/g, "u");
  str = str.replace(/ç/g, "c");
  str = str.replace(/ñ/g, "n");
  str = str.replace(/[^a-z0-9 -]/g, "");
  str = str.replace(/\s+/g, "-");
  str = str.replace(/-+/g, "-");

  return str;
}

async function uploadBase64Image(base64Image: string): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", base64Image);
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to upload image, reason : ", errorText);
    throw new Error("Failed to upload image");
  }
  const data = await response.json();
  return data.secure_url;
}

async function extractAndUploadImg(data: string): Promise<string> {
  const regex = /src="(data:image\/[^;]+;base64,[^"]+)"/g;
  const matches = [...data.matchAll(regex)];

  const replacements = await Promise.all(
    matches.map(async (match) => {
      const base64 = match[1];
      const uploadedUrl = await uploadBase64Image(base64);
      return {
        oldSrc: match[0],
        newSrc: `src="${uploadedUrl}"`,
      };
    }),
  );

  let updatedData = data;
  for (const { oldSrc, newSrc } of replacements) {
    updatedData = updatedData.replace(oldSrc, newSrc);
  }

  return updatedData;
}

export async function POST(request: Request) {
  const { error, success } = await auth.api.userHasPermission({
    body: {
      role: "admin",
      permission: { project: ["create"] },
    },
    headers: await headers(),
  });

  if (!success || error) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: 401 },
    );
  }

  const body: ProjectInterface = await request.json();
  const db = await connectToDB();
  body.description = await extractAndUploadImg(body.description);
  body.thumbnail = await uploadBase64Image(body.thumbnail);
  body.slug = slugify(body.title);

  body.updated_at = new Date();
  body.created_at = new Date();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = body;
  db.collection("projects").insertOne(rest);

  return new Response(JSON.stringify(body), { status: 201 });
}
