import prisma from "../prisma";

export default {
  //getall members with pagination==================
  getAll: async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.subscription.count(),
    ]);
    return{
        subscriptions,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    }
  },
  //function end====================================
  //get one by email================================
  getByEmail : async (email) =>{
    return prisma.subscription.findUnique({
         where: { email }
    })
  },
  //function end====================================
  //Create new member ==============================
  create : async (data) =>{
    return prisma.subscription.create({data})
  },
  //function end====================================
  //Update a member ================================
 update: async (email, data) => {
  try {
    return await prisma.subscription.update({
      where: { email },
      data,
    })
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma's "Record not found" error
      throw new Error('Subscription with that email does not exist.')
    }
    throw error // rethrow other unknown errors
  }
},
  //function end====================================
  //Hard Delete ====================================
  delete : async (email) =>{
    return prisma.subscription.delete({
        where:{email}
    })
  },
  //function end====================================
};
