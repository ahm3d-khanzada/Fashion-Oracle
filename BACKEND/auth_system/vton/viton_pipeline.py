import subprocess
import os
import cv2
import numpy as np
import glob
import shutil
import sys

def run_virtual_tryon_pipeline(human_image_path, cloth_image_path):
    static_folder = "./VTON/viton_model/static"

    # Step 1: Save original human image
    ori_img = cv2.imread(human_image_path)
    ori_img = cv2.resize(ori_img, (768, 1024))
    cv2.imwrite("./VTON/viton_model/origin.jpg", ori_img)

    # Also create resized image for Graphonomy
    img = cv2.resize(ori_img, (384, 512))
    cv2.imwrite("./VTON/viton_model/resized_img.jpg", img)

    # Step 2: Generate cloth mask
    subprocess.run([sys.executable, "get_cloth_mask.py", cloth_image_path], cwd="./VTON/viton_model", check=True)

    # Step 3: Run pose estimation
    subprocess.run([sys.executable, "posenet.py"], cwd="./VTON/viton_model", check=True)

    # Step 4: Graphonomy segmentation
    output_graphonomy_dir = "./VTON/viton_model/output_graphonomy/"
    os.makedirs(output_graphonomy_dir, exist_ok=True)

    subprocess.run([
        sys.executable, "exp/inference/inference.py",
        "--loadmodel", "inference.pth",
        "--img_path", "../resized_img.jpg",
        "--output_path", "../output_graphonomy/",
        "--output_name", "resized_segmentation_img"
    ], cwd="./VTON/viton_model/Graphonomy-master", check=True)

    # Copy output segmentation
    seg_img_path_src = os.path.join(output_graphonomy_dir, "resized_segmentation_img.png")
    seg_img_path_dst = "./VTON/viton_model/resized_segmentation_img.png"
    shutil.copy(seg_img_path_src, seg_img_path_dst)

    # Step 5: Process segmentation mask
    mask_img = cv2.imread(seg_img_path_src, cv2.IMREAD_GRAYSCALE)
    mask_img = cv2.resize(mask_img, (768, 1024))
    k = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    mask_img = cv2.erode(mask_img, k)

    img_seg = cv2.bitwise_and(ori_img, ori_img, mask=mask_img)
    back_ground = ori_img - img_seg
    img_seg = np.where(img_seg == 0, 215, img_seg)

    cv2.imwrite("./VTON/viton_model/seg_img.png", img_seg)

    # Step 6: HR-VITON image preparation
    hr_viton_test_path = "./VTON/viton_model/HR-VITON-main/test/test/image/"
    os.makedirs(hr_viton_test_path, exist_ok=True)
    img_for_hrviton = cv2.resize(img_seg, (768, 1024))
    cv2.imwrite(os.path.join(hr_viton_test_path, "00001_00.jpg"), img_for_hrviton)

    # Step 7: Preprocess
    subprocess.run([sys.executable, "get_seg_grayscale.py"], cwd="./VTON/viton_model", check=True)

    subprocess.run([
        sys.executable, "detectron2/projects/DensePose/apply_net.py", "dump",
        "detectron2/projects/DensePose/configs/densepose_rcnn_R_50_FPN_s1x.yaml",
        "https://dl.fbaipublicfiles.com/densepose/densepose_rcnn_R_50_FPN_s1x/165712039/model_final_162be9.pkl",
        "origin.jpg", "--output", "output.pkl", "-v"
    ], cwd="./VTON/viton_model", check=True)

    subprocess.run([sys.executable, "get_densepose.py"], cwd="./VTON/viton_model", check=True)

    # Step 8: Run Generator
    subprocess.run([
        sys.executable, "test_generator.py",
        "--cuda", "True",
        "--test_name", "test1",
        "--tocg_checkpoint", "mtviton.pth",
        "--gpu_ids", "0",
        "--gen_checkpoint", "gen.pth",
        "--datasetting", "unpaired",
        "--data_list", "t2.txt",
        "--dataroot", "./test"
    ], cwd="./VTON/viton_model/HR-VITON-main", check=True)

    # Step 9: Post-process
    output_images = glob.glob("./VTON/viton_model/HR-VITON-main/Output/*.png")
    for img_path in output_images:
        img = cv2.imread(img_path)
        img = cv2.bitwise_and(img, img, mask=mask_img)
        img = img + back_ground
        cv2.imwrite(img_path, img)

    # Step 10: Final save
    final_image_path = output_images[0] if output_images else None
    if final_image_path:
        final_saved_path = os.path.join(static_folder, "finalimg.png")
        cv2.imwrite(final_saved_path, cv2.imread(final_image_path))
        return final_saved_path

    return None
