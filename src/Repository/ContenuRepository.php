<?php

namespace App\Repository;

use App\Entity\Contenu;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Contenu>
 */
class ContenuRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Contenu::class);
    }

    public function findByCharBinary(string $char): array
    {
        // On récupère la connexion directe à la base de données (DBAL)
        $conn = $this->getEntityManager()->getConnection();

        // On récupère le nom de la table et de la colonne à partir des métadonnées de l'entité
        // pour rendre la requête plus robuste et moins dépendante de noms en dur.
        $meta = $this->getClassMetadata();
        $tableName = $meta->getTableName();
        $columnName = $meta->getColumnName('contenu');
        $sql = '
        SELECT * FROM ' . $conn->quoteIdentifier($tableName) . '
        WHERE BINARY UPPER(' . $conn->quoteIdentifier($columnName) . ') = UPPER(:char)
    ';

        // On exécute la requête en passant le paramètre de manière sécurisée
        $resultSet = $conn->executeQuery($sql, ['char' => $char]);
        $rows = $resultSet->fetchAllAssociative();

        // Doctrine ne peut pas hydrater automatiquement le résultat d'une requête native simple.
        // Nous devons donc le faire manuellement en retrouvant les entités par leur ID.
        if (empty($rows)) {
            return [];
        }

        $ids = array_column($rows, 'id');

        // On utilise une requête DQL classique (et performante) pour récupérer les objets Entité
        // correspondant aux résultats de la requête native.
        return $this->createQueryBuilder('c')
            ->andWhere('c.id IN (:ids)')
            ->setParameter('ids', $ids)
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return Contenu[] Returns an array of Contenu objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Contenu
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
