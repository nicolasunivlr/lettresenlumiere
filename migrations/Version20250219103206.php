<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250219103206 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX `primary` ON contenu_exercice');
        $this->addSql('ALTER TABLE contenu_exercice ADD contenu_id INT NOT NULL');
        $this->addSql('ALTER TABLE contenu_exercice ADD CONSTRAINT FK_596D469C3C1CC488 FOREIGN KEY (contenu_id) REFERENCES contenu (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contenu_exercice ADD CONSTRAINT FK_596D469C89D40298 FOREIGN KEY (exercice_id) REFERENCES exercice (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_596D469C3C1CC488 ON contenu_exercice (contenu_id)');
        $this->addSql('CREATE INDEX IDX_596D469C89D40298 ON contenu_exercice (exercice_id)');
        $this->addSql('ALTER TABLE contenu_exercice ADD PRIMARY KEY (contenu_id, exercice_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contenu_exercice DROP FOREIGN KEY FK_596D469C3C1CC488');
        $this->addSql('ALTER TABLE contenu_exercice DROP FOREIGN KEY FK_596D469C89D40298');
        $this->addSql('DROP INDEX IDX_596D469C3C1CC488 ON contenu_exercice');
        $this->addSql('DROP INDEX IDX_596D469C89D40298 ON contenu_exercice');
        $this->addSql('DROP INDEX `PRIMARY` ON contenu_exercice');
        $this->addSql('ALTER TABLE contenu_exercice DROP contenu_id');
        $this->addSql('ALTER TABLE contenu_exercice ADD PRIMARY KEY (exercice_id)');
    }
}
