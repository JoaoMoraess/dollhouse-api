import { Migration } from '@mikro-orm/migrations'

export class Migration20220114134914 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table "User" ("id" text not null, "email" text not null, "name" text not null, "password" text not null, "role" text null);')
    this.addSql('alter table "User" add constraint "User_pkey" primary key ("id");')

    this.addSql('create table "Product" ("id" text not null, "name" text not null, "stock" int4 not null, "price" int4 not null, "imageUrl" text not null);')
    this.addSql('alter table "Product" add constraint "Product_pkey" primary key ("id");')

    this.addSql('create table "Order" ("id" text not null, "total" int4 not null, "cep" text not null, "pagSeguroId" text not null, "confirmed" bool not null, "sent" bool not null, "deliveryCost" int4 not null, "subTotal" int4 not null);')
    this.addSql('alter table "Order" add constraint "Order_pkey" primary key ("id");')

    this.addSql('create table "OrderProduct" ("id" text not null, "product" text not null, "quantity" int4 not null, "order" text not null);')
    this.addSql('alter table "OrderProduct" add constraint "OrderProduct_pkey" primary key ("id");')

    this.addSql('alter table "OrderProduct" add constraint "OrderProduct_product_foreign" foreign key ("product") references "Product" ("id") on update cascade;')
    this.addSql('alter table "OrderProduct" add constraint "OrderProduct_order_foreign" foreign key ("order") references "Order" ("id") on update cascade on delete cascade;')
  }
}
