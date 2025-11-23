import { remember } from '@epic-web/remember';
import { PrismaClient } from '#app/../generated/prisma';
export var prisma = remember('prisma', function () {
    var client = new PrismaClient();
    void client.$connect();
    return client;
});
