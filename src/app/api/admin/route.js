import { getAllAdmins, addAdmin } from '../../lib/services/adminservices';

export async function GET(req) {
  try {
    const admins = await getAllAdmins();
    return new Response(JSON.stringify({ admins }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const admin = await addAdmin(body);
    return new Response(JSON.stringify(admin), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
} 