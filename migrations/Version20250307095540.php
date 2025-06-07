<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250307095540 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contenu_format (id INT AUTO_INCREMENT NOT NULL, couleur_id INT DEFAULT NULL, contenu_id INT DEFAULT NULL, lettres VARCHAR(255) NOT NULL, INDEX IDX_7A2602EDC31BA576 (couleur_id), INDEX IDX_7A2602ED3C1CC488 (contenu_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contenu_format ADD CONSTRAINT FK_7A2602EDC31BA576 FOREIGN KEY (couleur_id) REFERENCES couleur (id)');
        $this->addSql('ALTER TABLE contenu_format ADD CONSTRAINT FK_7A2602ED3C1CC488 FOREIGN KEY (contenu_id) REFERENCES contenu (id)');
        $this->addSql('ALTER TABLE contenu DROP FOREIGN KEY FK_89C2003FC31BA576');
        $this->addSql('DROP INDEX IDX_89C2003FC31BA576 ON contenu');
        $this->addSql('ALTER TABLE contenu DROP couleur_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contenu_format DROP FOREIGN KEY FK_7A2602EDC31BA576');
        $this->addSql('ALTER TABLE contenu_format DROP FOREIGN KEY FK_7A2602ED3C1CC488');
        $this->addSql('DROP TABLE contenu_format');
        $this->addSql('ALTER TABLE contenu ADD couleur_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE contenu ADD CONSTRAINT FK_89C2003FC31BA576 FOREIGN KEY (couleur_id) REFERENCES couleur (id)');
        $this->addSql('CREATE INDEX IDX_89C2003FC31BA576 ON contenu (couleur_id)');
    }
}
