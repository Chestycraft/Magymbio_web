import { getAllRoles, addRole } from '../../lib/services/adminservices';

export async function GET(req) {
  try {
    const roles = await getAllRoles();
    return new Response(JSON.stringify({ roles }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const role = await addRole(body);
    return new Response(JSON.stringify(role), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
} 