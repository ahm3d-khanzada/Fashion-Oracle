from diffusers import StableDiffusionPipeline
import torch
from io import BytesIO
import base64

class FashionGenerator:
    def __init__(self, model_path="F:\\Connecting (1)\\Connecting\\BACKEND\pytorch_lora_weights (2).safetensors"):
        # Load the pipeline
        self.pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            safety_checker=None,
            torch_dtype=torch.float32
        ).to("cuda")

        # Load LoRA weights
        self.pipe.load_lora_weights(model_path)
        self.pipe.enable_attention_slicing()

    def generate(self, prompt, negative_prompt=None):
        # Prepare the prompts
        final_prompt = f"Fashion item: {prompt}, product photography, studio lighting, onlycloths"
        negative = negative_prompt or "person, face, hands, text, watermark, deformed, blurry , Human , Hair , eyes ,"

        # Generate the image
        image = self.pipe(
            prompt=final_prompt,
            negative_prompt=negative,
            guidance_scale=9.0,
            num_inference_steps=50,
            width=512,
            height=512
        ).images[0]

        # Convert image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return img_str