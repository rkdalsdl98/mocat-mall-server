-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baskets" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "salePrice" INTEGER NOT NULL DEFAULT 0,
    "validAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "couponNumber" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "qaboard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '배송관련 문의',
    "contentText" TEXT NOT NULL,
    "productId" INTEGER NOT NULL DEFAULT -1,
    "visited" INTEGER NOT NULL DEFAULT 0,
    "writerEmail" TEXT NOT NULL,
    "writerName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qaboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reply" (
    "id" SERIAL NOT NULL,
    "contentText" TEXT NOT NULL,
    "writerEmail" TEXT NOT NULL,
    "writerName" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,

    CONSTRAINT "reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/mocatmall.appspot.com/o/exception%2Fnotfound.PNG?alt=media&token=1af683ff-9a2b-4ca2-aea4-98c742c22235',

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productdetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "colors" TEXT[],
    "sizes" TEXT[],
    "images" TEXT[],
    "description" TEXT NOT NULL,

    CONSTRAINT "productdetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "orderId" TEXT NOT NULL,
    "paymentKey" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "delivery" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "detailAddress" TEXT NOT NULL,
    "memo" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "productId" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_couponNumber_key" ON "coupon"("couponNumber");

-- CreateIndex
CREATE UNIQUE INDEX "qaboard_userId_key" ON "qaboard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "productdetail_productId_key" ON "productdetail"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "order_orderId_key" ON "order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_userId_key" ON "order"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_orderId_key" ON "delivery"("orderId");

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qaboard" ADD CONSTRAINT "qaboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "qaboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productdetail" ADD CONSTRAINT "productdetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
