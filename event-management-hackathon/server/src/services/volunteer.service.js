const User = require('../models/User');

const buildVolunteerPayload = (user) => {
  const role = user.role || 'volunteer';
  const skillPool = [
    'Logistics',
    'First Aid',
    'Registration',
    'Crowd Management',
    'Marketing',
    'Photography',
  ];
  const availabilityPool = ['Weekdays', 'Weekends', 'Flexible'];
  const eventPool = ['Summer Tech Meetup', 'Community Festival', 'Volunteer Training'];
  const skill = skillPool[(user._id?.toString().length || 0) % skillPool.length];
  const availability = availabilityPool[(user._id?.toString().length || 0) % availabilityPool.length];
  const event = eventPool[(user._id?.toString().length || 0) % eventPool.length];

  return {
    id: user._id?.toString() || user.id,
    _id: user._id?.toString() || user.id,
    name: user.name,
    role,
    skills: [skill, skill === 'Logistics' ? 'Coordination' : 'Team Support'],
    availability,
    assignedEvent: event,
    completionPercent: 60 + ((user._id?.toString().length || 0) % 40),
    email: user.email,
    phone: '+91 90000 00000',
    avatar: `https://i.pravatar.cc/150?img=${(user._id?.toString().length || 1) % 70}`,
    experience: 'Active volunteer with event support experience.',
    certificates: ['Community Support'],
  };
};

const getVolunteers = async () => {
  const users = await User.find({ role: 'volunteer' }).lean();
  return users.map(buildVolunteerPayload);
};

const getVolunteerById = async (id) => {
  const user = await User.findById(id).lean();
  if (!user) return null;
  return buildVolunteerPayload(user);
};

module.exports = {
  getVolunteers,
  getVolunteerById,
};
