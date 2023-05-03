from django.db import models

class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        self.update(is_deleted=True)
    
class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).exclude(is_deleted=True)
    
class IncludeDeletedItemsManager(models.Manager):
    def get_queryset(self):
        return models.QuerySet(self.model, using=self._db)

class BaseModel(models.Model):
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()
    all_items = IncludeDeletedItemsManager()

    class Meta:
        abstract = True

    def delete(self):
        """Mark the record as deleted instead of deleting it""" 

        self.is_deleted = True
        self.save()

