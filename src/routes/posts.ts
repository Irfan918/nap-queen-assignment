import express, { Router, Request, Response } from 'express';
import { validationResult, body, param } from 'express-validator';
import Post, { IPost } from '../models/Post';

const router: Router = express.Router();

// Retrieve a list of all blog posts.
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Retrieve a specific blog post by its ID.
router.get('/:id', [
  param('id').isMongoId(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new blog post. 
router.post('/create', [
  body('title').isString().notEmpty(),
  body('content').isString().notEmpty(),
  body('category_id').isMongoId(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, content, category_id } = req.body;    
    const post = new Post({ title, content, category_id });
    const savedPost = await post.save();

    return res.json(savedPost);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing blog post by its ID.
router.put('/update/:id', [
  param('id').isMongoId(),
  body('title').isString().notEmpty(),
  body('content').isString().notEmpty(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, updated_at: new Date() },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:id: Delete a blog post by its ID.
router.delete('/remove/:id', [
  param('id').isMongoId(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve the latest blog post from each unique category.
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const latestPosts: IPost[] = await Post.aggregate([
      {
        $group: {
          _id: '$category_id',
          latestPost: { $last: '$$ROOT' },
        },
      },
    ]);
    res.json(latestPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
