from django.test import TestCase

from plant.models import Plant


class PlantTestCase(TestCase):
    plant_list = []
    for i in range(20):
        data = {
            'plant_name': f'무럭무럭 나무{i}'
        }
        plant_list.append(Plant(**data))

    Plant.objects.bulk_create(plant_list)
