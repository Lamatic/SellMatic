# Miami-Hack-Week

## 🌟 Inspiration
### The Universal Commercial Challenge: Understanding Customer Needs
In the hardware product industry, businesses often spend considerable time identifying customer requirements and guiding them to the appropriate products. SellMatic was inspired by the need to streamline this process, making it more efficient and tailored to individual customer preferences.

## 🚀 What it does
> SellMatic is a GenAI-powered sales agent designed to improve checkout experience for physical products. Here’s how it enhances the customer experience:

- **⏳ Saves Time**: Reduces the time customers spend searching for the perfect item.
- **🛠️ Customization**: Facilitates "Made-to-Order" capabilities.
- **🔍 Intuitive Search**: Utilizes natural language processing to easily find the right product.

**Steps:**
1. **Input**: Customers type in their requirements.
2. **Search**: AI-powered image search identifies the closest product from the catalog.
3. **Feedback**: Customers can provide feedback for further customization if the initial options are not satisfactory.
4. **Customization**: SellMatic generates a customized product image based on the closest match in the catalog.

**✨ Key Features:**
1. **Adaptability**: Can be trained on various products, making it suitable for diverse businesses.
2. **Efficient Search**: Uses vector image search to pinpoint the right product with minimal input.
3. **Creative Output**: Generates custom images using Stable Diffusion models.

## 🛠️ How We Built It
![Workflow](https://i.ibb.co/M7DQkH8/Screenshot-2024-04-11-at-9-51-19-PM.png)

SellMatic comprises four main components:
1. **Training**: Ingests images from any catalog and trains them in our vector database using the Image2Vec model.
2. **Image Vector Search**: Leverages the vector database to find similar products from the catalog based on text descriptions.
3. **Image Generation**: Utilizes prompts and base images to generate customized product visuals via the MidJourney API.
4. **User Interface**: A frontend application built with NextJS for an intuitive user experience.

## 🚧 Challenges We Faced
1. **Initial Image Accuracy**: Early image generations were imprecise, prompting us to explore various approaches.
2. **Scene Complexity**: Initially aimed to create scenes with multiple furniture items, but pivoted due to unsatisfactory results.
3. **Search Optimization**: Fine-tuning the image search proved challenging and required diverse vector techniques.

## ✨ Accomplishments
1. **Functionality**: The app is fully operational!
2. **User-Friendliness**: Simple and intuitive interface.
3. **Scalability**: Offers vast potential for adoption across different industries.

## 🎓 What We Learned
1. **Exploration**: The importance of trying diverse methodologies.
2. **Agility**: The value of rapid iteration.
3. **Planning**: The necessity of clear, strategic planning before execution.

## 🔮 What's Next for SellMatic
We envision SellMatic as just the beginning. We plan to integrate it into Lamatic.ai to expand its reach to more businesses. Additionally, we are hopeful about potential interest from City Furniture, which served as one of our initial inspirations. 😉 
