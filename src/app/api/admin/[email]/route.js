import { getAdminByEmail, updateAdmin, deleteAdmin } from '../../../lib/services/adminservices';

export async function GET(req, { params }) {
  try {
    const admin = await getAdminByEmail(params.email);
    if (!admin) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    return new Response(JSON.stringify(admin), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await updateAdmin(params.email, body);
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await deleteAdmin(params.email);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
} 