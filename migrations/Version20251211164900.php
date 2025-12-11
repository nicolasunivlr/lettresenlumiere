<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251211164900 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE account_profile (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, UNIQUE INDEX UNIQ_487CBE47A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contenu (id INT AUTO_INCREMENT NOT NULL, sequence_id INT NOT NULL, contenu VARCHAR(255) NOT NULL, image_url VARCHAR(255) DEFAULT NULL, audio_url VARCHAR(255) DEFAULT NULL, syllabes VARCHAR(255) DEFAULT NULL, INDEX IDX_89C2003F98FB19AE (sequence_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contenu_exercice (contenu_id INT NOT NULL, exercice_id INT NOT NULL, INDEX IDX_596D469C3C1CC488 (contenu_id), INDEX IDX_596D469C89D40298 (exercice_id), PRIMARY KEY(contenu_id, exercice_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contenu_format (id INT AUTO_INCREMENT NOT NULL, couleur_id INT DEFAULT NULL, contenu_id INT DEFAULT NULL, lettres VARCHAR(255) NOT NULL, bold TINYINT(1) DEFAULT NULL, INDEX IDX_7A2602EDC31BA576 (couleur_id), INDEX IDX_7A2602ED3C1CC488 (contenu_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE couleur (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE etape (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE exercice (id INT AUTO_INCREMENT NOT NULL, sequence_id INT NOT NULL, type_exercice VARCHAR(255) NOT NULL, consigne LONGTEXT DEFAULT NULL, ordre INT DEFAULT NULL, audio_url VARCHAR(255) DEFAULT NULL, INDEX IDX_E418C74D98FB19AE (sequence_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE progression (id INT AUTO_INCREMENT NOT NULL, exercice_id INT NOT NULL, account_profile_id INT NOT NULL, score INT NOT NULL, INDEX IDX_D5B2507389D40298 (exercice_id), INDEX IDX_D5B250733061E01C (account_profile_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sequence (id INT AUTO_INCREMENT NOT NULL, etape_id INT NOT NULL, nom VARCHAR(255) NOT NULL, video_url VARCHAR(255) DEFAULT NULL, INDEX IDX_5286D72B4A8CA2AD (etape_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE account_profile ADD CONSTRAINT FK_487CBE47A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contenu ADD CONSTRAINT FK_89C2003F98FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('ALTER TABLE contenu_exercice ADD CONSTRAINT FK_596D469C3C1CC488 FOREIGN KEY (contenu_id) REFERENCES contenu (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contenu_exercice ADD CONSTRAINT FK_596D469C89D40298 FOREIGN KEY (exercice_id) REFERENCES exercice (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contenu_format ADD CONSTRAINT FK_7A2602EDC31BA576 FOREIGN KEY (couleur_id) REFERENCES couleur (id)');
        $this->addSql('ALTER TABLE contenu_format ADD CONSTRAINT FK_7A2602ED3C1CC488 FOREIGN KEY (contenu_id) REFERENCES contenu (id)');
        $this->addSql('ALTER TABLE exercice ADD CONSTRAINT FK_E418C74D98FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('ALTER TABLE progression ADD CONSTRAINT FK_D5B2507389D40298 FOREIGN KEY (exercice_id) REFERENCES exercice (id)');
        $this->addSql('ALTER TABLE progression ADD CONSTRAINT FK_D5B250733061E01C FOREIGN KEY (account_profile_id) REFERENCES account_profile (id)');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72B4A8CA2AD FOREIGN KEY (etape_id) REFERENCES etape (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE account_profile DROP FOREIGN KEY FK_487CBE47A76ED395');
        $this->addSql('ALTER TABLE contenu DROP FOREIGN KEY FK_89C2003F98FB19AE');
        $this->addSql('ALTER TABLE contenu_exercice DROP FOREIGN KEY FK_596D469C3C1CC488');
        $this->addSql('ALTER TABLE contenu_exercice DROP FOREIGN KEY FK_596D469C89D40298');
        $this->addSql('ALTER TABLE contenu_format DROP FOREIGN KEY FK_7A2602EDC31BA576');
        $this->addSql('ALTER TABLE contenu_format DROP FOREIGN KEY FK_7A2602ED3C1CC488');
        $this->addSql('ALTER TABLE exercice DROP FOREIGN KEY FK_E418C74D98FB19AE');
        $this->addSql('ALTER TABLE progression DROP FOREIGN KEY FK_D5B2507389D40298');
        $this->addSql('ALTER TABLE progression DROP FOREIGN KEY FK_D5B250733061E01C');
        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B4A8CA2AD');
        $this->addSql('DROP TABLE account_profile');
        $this->addSql('DROP TABLE contenu');
        $this->addSql('DROP TABLE contenu_exercice');
        $this->addSql('DROP TABLE contenu_format');
        $this->addSql('DROP TABLE couleur');
        $this->addSql('DROP TABLE etape');
        $this->addSql('DROP TABLE exercice');
        $this->addSql('DROP TABLE progression');
        $this->addSql('DROP TABLE sequence');
        $this->addSql('DROP TABLE user');
    }
}
