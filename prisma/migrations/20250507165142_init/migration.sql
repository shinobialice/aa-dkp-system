-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "class" TEXT,
    "secondary_class" TEXT,
    "class_gear_score" INTEGER,
    "secondary_class_gear_score" INTEGER,
    "vk_name" TEXT,
    "active" BOOLEAN NOT NULL,
    "is_eligible_for_salary" BOOLEAN NOT NULL,
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "salaryBonus" INTEGER DEFAULT 0,
    "google_id" VARCHAR,
    "vk_id" VARCHAR,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tags" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_inventory" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT,
    "name" TEXT,
    "quality" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER DEFAULT 1,

    CONSTRAINT "user_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raid" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "start_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "is_pvp" BOOLEAN DEFAULT false,
    "is_pvp_long" BOOLEAN DEFAULT false,
    "dkp_summary" INTEGER DEFAULT 0,

    CONSTRAINT "raid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boss" (
    "id" SERIAL NOT NULL,
    "boss_name" TEXT NOT NULL,
    "dkp_points" INTEGER NOT NULL,
    "category" TEXT,

    CONSTRAINT "boss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raid_boss" (
    "raid_id" INTEGER NOT NULL,
    "boss_id" INTEGER NOT NULL,

    CONSTRAINT "raid_boss_pkey" PRIMARY KEY ("raid_id","boss_id")
);

-- CreateTable
CREATE TABLE "raid_attendance" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "raid_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raid_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION,

    CONSTRAINT "item_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loot" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "sold_at" TIMESTAMP(3),
    "sold_to" TEXT,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" VARCHAR(255),
    "acquired_at" TIMESTAMP(6),
    "item_type_id" INTEGER NOT NULL,
    "sold_to_user_id" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER,
    "group_id" INTEGER,

    CONSTRAINT "loot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks_user" (
    "tasks_user_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tasks_user_pkey" PRIMARY KEY ("tasks_user_id","user_id")
);

-- CreateTable
CREATE TABLE "loot_queue" (
    "id" SERIAL NOT NULL,
    "item_type_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'ожидание',
    "synth_target" TEXT,
    "remaining" INTEGER,
    "required" INTEGER NOT NULL DEFAULT 1,
    "delivered" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "loot_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "givenawayloot" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,

    CONSTRAINT "givenawayloot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "amount" INTEGER NOT NULL,
    "target" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildFunds" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalIncome" INTEGER NOT NULL,
    "totalExpenses" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "salaryBudget" INTEGER NOT NULL,
    "treasuryLeft" INTEGER NOT NULL,

    CONSTRAINT "GuildFunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "bonus" INTEGER,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_salary_bonus" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_salary_bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_token" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "link_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_googleId_key" ON "user"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_vkId_key" ON "user"("vk_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_type_name_key" ON "item_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_loot_unique" ON "givenawayloot"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "link_token_token_key" ON "link_token"("token");

-- AddForeignKey
ALTER TABLE "user_tags" ADD CONSTRAINT "user_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_inventory" ADD CONSTRAINT "user_inventory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raid_boss" ADD CONSTRAINT "raid_boss_boss_id_fkey" FOREIGN KEY ("boss_id") REFERENCES "boss"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raid_boss" ADD CONSTRAINT "raid_boss_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "raid"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raid_attendance" ADD CONSTRAINT "raid_attendance_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "raid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raid_attendance" ADD CONSTRAINT "raid_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loot" ADD CONSTRAINT "fk_item_type" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "loot" ADD CONSTRAINT "fk_sold_to_user" FOREIGN KEY ("sold_to_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks_user" ADD CONSTRAINT "tasks_user_tasks_user_id_fkey" FOREIGN KEY ("tasks_user_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_user" ADD CONSTRAINT "tasks_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loot_queue" ADD CONSTRAINT "loot_queue_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "loot_queue" ADD CONSTRAINT "loot_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "givenawayloot" ADD CONSTRAINT "givenawayloot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_salary_bonus" ADD CONSTRAINT "user_salary_bonus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "link_token" ADD CONSTRAINT "link_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
