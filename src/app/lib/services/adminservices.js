import prisma from '../../lib/prisma';

export async function getAllRoles() {
  return await prisma.roles.findMany();
}

export async function getRoleByEmail(email) {
  return await prisma.roles.findUnique({ where: { email } });
}

export async function addRole(data) {
  return await prisma.roles.create({ data });
}

export async function updateRole(email, data) {
  return await prisma.roles.update({ where: { email }, data });
}

export async function deleteRole(email) {
  return await prisma.roles.delete({ where: { email } });
} 