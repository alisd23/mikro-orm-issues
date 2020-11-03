import { Migration } from '@mikro-orm/migrations';

export class Migration20201103213505 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `base_person` (`id` int unsigned not null auto_increment primary key, `type` enum(\'manager\', \'employee\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `base_person` add index `base_person_type_index`(`type`);');

    this.addSql('create table `address` (`id` int unsigned not null auto_increment primary key, `line1` varchar(255) not null, `person_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `address` add index `address_person_id_index`(`person_id`);');

    this.addSql('alter table `address` add constraint `address_person_id_foreign` foreign key (`person_id`) references `base_person` (`id`) on update cascade;');
  }

}
