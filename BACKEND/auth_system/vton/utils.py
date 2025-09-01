import os
from django.conf import settings

def save_temp_file(uploaded_file, image_type="cloth"):
    """
    Save uploaded image to viton_model/static/ with specific filenames.
    :param uploaded_file: The uploaded file object.
    :param image_type: 'cloth' or 'human' to determine filename.
    :return: Absolute file path of the saved image.
    """
    # Define the target folder
    target_folder = os.path.join(settings.BASE_DIR, 'VTON', 'viton_model', 'static')
    os.makedirs(target_folder, exist_ok=True)

    # Determine filename based on image_type
    filename = 'cloth_web.jpg' if image_type == 'cloth' else 'origin_web.jpg'
    file_path = os.path.join(target_folder, filename)

    # Remove existing file if it exists
    if os.path.exists(file_path):
        os.remove(file_path)

    # Save the uploaded file
    with open(file_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    return file_path