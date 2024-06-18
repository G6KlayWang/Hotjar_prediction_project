from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import os
import Util
from django.conf import settings

@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['fileInput']
        df = pd.read_csv(file)
        predictions = Util.get_prediction(df)

        df['Prediction'] = predictions
        result_file_path = os.path.join(settings.MEDIA_ROOT, 'processed.csv')
        df.to_csv(result_file_path, index=False)

        return JsonResponse({'status': 'success', 'file_path': '/media/processed.csv'})
    return JsonResponse({'status': 'failed'})

def home(request):
    return render(request, 'index.html')


