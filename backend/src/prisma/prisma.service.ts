import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // ← use default import

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // This method is called once the module has been initialized.
    // We connect to the database here.
    await this.$connect();
  }
}
