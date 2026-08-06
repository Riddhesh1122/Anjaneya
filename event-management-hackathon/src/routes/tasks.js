const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');
const { mockTasks, nextMockId } = require('../utils/mockStore');

// GET /api/tasks
// Organizers/admins see everything (optionally filtered by ?event=).
// Volunteers only ever see their own assigned tasks.
router.get('/', protect, async (req, res) => {
  try {
    const isOrganizer = ['organizer', 'admin'].includes(req.user.role);

    if (mongoose.connection.readyState !== 1) {
      let list = mockTasks;
      if (req.query.event) list = list.filter((t) => String(t.event) === String(req.query.event));
      if (!isOrganizer) list = list.filter((t) => String(t.assignedVolunteer) === String(req.user.id));
      return res.json(list);
    }

    const q = {};
    if (req.query.event) q.event = req.query.event;
    if (!isOrganizer) q.assignedVolunteer = req.user.id;
    const list = await Task.find(q).populate('assignedVolunteer', 'name email').populate('event', 'title').sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/tasks (organizer only) — create a task, optionally pre-assigning a volunteer
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { title, description, event, assignedVolunteer } = req.body;
    if (!title || !event) {
      return res.status(400).json({ error: 'title and event are required.' });
    }
    const status = assignedVolunteer ? 'assigned' : 'unassigned';

    if (mongoose.connection.readyState !== 1) {
      const task = { _id: nextMockId(), title, description, event, assignedVolunteer: assignedVolunteer || null, status, createdAt: new Date() };
      mockTasks.push(task);
      return res.status(201).json(task);
    }

    const task = await Task.create({ title, description, event, assignedVolunteer: assignedVolunteer || null, status });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id
// Organizers can assign/reassign/remove a volunteer or edit any field.
// A volunteer may only update the status of a task assigned to them (e.g. mark in_progress/done).
router.patch('/:id', protect, async (req, res) => {
  try {
    const isOrganizer = ['organizer', 'admin'].includes(req.user.role);

    if (mongoose.connection.readyState !== 1) {
      const task = mockTasks.find((t) => String(t._id) === String(req.params.id));
      if (!task) return res.status(404).json({ error: 'Task not found.' });
      if (!isOrganizer) {
        if (String(task.assignedVolunteer) !== String(req.user.id)) {
          return res.status(403).json({ error: 'You can only update your own tasks.' });
        }
        if (req.body.status) task.status = req.body.status;
        return res.json(task);
      }
      const { title, description, assignedVolunteer, status } = req.body;
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedVolunteer !== undefined) {
        task.assignedVolunteer = assignedVolunteer || null;
        task.status = assignedVolunteer ? (status || 'assigned') : 'unassigned';
      } else if (status !== undefined) {
        task.status = status;
      }
      return res.json(task);
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    if (!isOrganizer) {
      if (!task.assignedVolunteer || String(task.assignedVolunteer) !== String(req.user.id)) {
        return res.status(403).json({ error: 'You can only update your own tasks.' });
      }
      if (req.body.status) task.status = req.body.status;
      await task.save();
      return res.json(task);
    }

    const { title, description, assignedVolunteer, status } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedVolunteer !== undefined) {
      task.assignedVolunteer = assignedVolunteer || null;
      task.status = assignedVolunteer ? (status || 'assigned') : 'unassigned';
    } else if (status !== undefined) {
      task.status = status;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id (organizer only) — also used to "remove an assignment" by clearing the volunteer
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockTasks.findIndex((t) => String(t._id) === String(req.params.id));
      if (idx !== -1) mockTasks.splice(idx, 1);
      return res.json({ ok: true });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
