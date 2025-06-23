import prisma from '../../lib/prisma';

export async function getAllAdmins() {
  return await prisma.admin.findMany();
}

export async function getAdminByEmail(email) {
  return await prisma.admin.findUnique({ where: { email } });
}

export async function addAdmin(data) {
  return await prisma.admin.create({ data });
}

export async function updateAdmin(email, data) {
  return await prisma.admin.update({ where: { email }, data });
}

export async function deleteAdmin(email) {
  return await prisma.admin.delete({ where: { email } });
} 