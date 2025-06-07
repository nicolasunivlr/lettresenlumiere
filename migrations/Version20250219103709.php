<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250219103709 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contenu_exercice (contenu_id INT NOT NULL, exercice_id INT NOT NULL, INDEX IDX_596D469C3C1CC488 (contenu_id), INDEX IDX_596D469C89D40298 (exercice_id), PRIMARY KEY(contenu_id, exercice_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contenu_exercice ADD CONSTRAINT FK_596D469C3C1CC488 FOREIGN KEY (contenu_id) REFERENCES contenu (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contenu_exercice ADD CONSTRAINT FK_596D469C89D40298 FOREIGN KEY (exercice_id) REFERENCES exercice (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contenu DROP FOREIGN KEY FK_89C2003F89D40298');
        $this->addSql('DROP INDEX IDX_89C2003F89D40298 ON contenu');
        $this->addSql('ALTER TABLE contenu DROP exercice_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contenu_exercice DROP FOREIGN KEY FK_596D469C3C1CC488');
        $this->addSql('ALTER TABLE contenu_exercice DROP FOREIGN KEY FK_596D469C89D40298');
        $this->addSql('DROP TABLE contenu_exercice');
        $this->addSql('ALTER TABLE contenu ADD exercice_id INT NOT NULL');
        $this->addSql('ALTER TABLE contenu ADD CONSTRAINT FK_89C2003F89D40298 FOREIGN KEY (exercice_id) REFERENCES exercice (id)');
        $this->addSql('CREATE INDEX IDX_89C2003F89D40298 ON contenu (exercice_id)');
    }
}
