import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { Category } from './types'

const app = express()
const PORT = process.env.PORT || 8080
const MONGODB_URL = process.env.MONGODB_URL || 'localhost'

const Schema = mongoose.Schema

app.use(cors())
app.use(express.json())
app.use('/robots.txt', express.static('robots.txt'))

async function init() {
  await mongoose.connect(`mongodb://${MONGODB_URL}/the-crew`, {
    user: 'root',
    pass: 'example',
    authSource: 'admin'
  })
  console.log("Database created")
}

const CategorySchema = new Schema<Category>({
  title: { type: String, unique: true, required: true },
  description: { type: String, required: true },
});

const CategoryModel = mongoose.model<Category>('Category', CategorySchema)

app.get("/", (_req, res) => {
  res.send("The crew API")
})

app.get("/categories", (_req, res) => {
  CategoryModel.find({}).then((cats) => {
    res.json(cats.map(v => ({
      title: v.title,
      description: v.description
    } as Category)))
  }).catch(err => res.json(err))
})

app.post("/categories", (req, res) => {
  const instance = new CategoryModel({
    title: req.body.title,
    description: req.body.description
  })
  instance.save()
    .then(el => {
      res.status(201).json({
        title: el.title,
        description: el.description
      })
    })
    .catch(err => {
      console.error(err)
      res.status(400).json(err)
    })
})

app.get("/categories/vote", (_req, res) => {
  res.json()
})

app.post("/categories/vote", (_req, res) => {
  res.json()
})

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error(err)
})
