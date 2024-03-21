## Prisma ORM

PostreSQL url schema: ```postgresql://USER:PASSWORD@HOST:PORT/DATABASE?KEY1=VALUE&KEY2=VALUE&KEY3=VALUE```

Open Prisma Studio: ```npx prisma studio```

Add DB migration: ```npx prisma migrate dev --name init```

Force DB update based on schema: ```npx prisma db push```

Update Prisma Client: ```npx prisma generate```