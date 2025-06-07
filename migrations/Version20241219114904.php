<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241219114904 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contenu (id INT AUTO_INCREMENT NOT NULL, exercice_id INT NOT NULL, sequence_id INT NOT NULL, contenu VARCHAR(255) NOT NULL, image_url VARCHAR(255) NOT NULL, audio_url VARCHAR(255) NOT NULL, INDEX IDX_89C2003F89D40298 (exercice_id), INDEX IDX_89C2003F98FB19AE (sequence_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE etape (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE exercice (id INT AUTO_INCREMENT NOT NULL, sequence_id INT NOT NULL, type_exercice VARCHAR(255) NOT NULL, consigne LONGTEXT DEFAULT NULL, INDEX IDX_E418C74D98FB19AE (sequence_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sequence (id INT AUTO_INCREMENT NOT NULL, etape_id INT NOT NULL, nom VARCHAR(255) NOT NULL, video_url VARCHAR(255) DEFAULT NULL, INDEX IDX_5286D72B4A8CA2AD (etape_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contenu ADD CONSTRAINT FK_89C2003F89D40298 FOREIGN KEY (exercice_id) REFERENCES exercice (id)');
        $this->addSql('ALTER TABLE contenu ADD CONSTRAINT FK_89C2003F98FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('ALTER TABLE exercice ADD CONSTRAINT FK_E418C74D98FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72B4A8CA2AD FOREIGN KEY (etape_id) REFERENCES etape (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contenu DROP FOREIGN KEY FK_89C2003F89D40298');
        $this->addSql('ALTER TABLE contenu DROP FOREIGN KEY FK_89C2003F98FB19AE');
        $this->addSql('ALTER TABLE exercice DROP FOREIGN KEY FK_E418C74D98FB19AE');
        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B4A8CA2AD');
        $this->addSql('DROP TABLE contenu');
        $this->addSql('DROP TABLE etape');
        $this->addSql('DROP TABLE exercice');
        $this->addSql('DROP TABLE sequence');
    }
}
