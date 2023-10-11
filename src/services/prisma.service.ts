import { Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()
    }
}

export type PrismaDB = Omit<
PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
'$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>

export namespace feedRepository {
    export namespace like {
        export const checkAlreadyLiked =
        (prisma: PrismaDB) =>
        async (userId: number) : Promise<boolean> => {
            const like = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            return !!like
        }
    }
}