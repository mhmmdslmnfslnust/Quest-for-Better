import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Target, Palette, Calendar, Zap } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 0 24px 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--color-text-primary);
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #2a2a2a;
    color: white;
  }
`;

const ColorPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? 'white' : 'transparent'};
  background: ${props => props.color};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 4px;
    background: ${props => props.color};
  }
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const IconOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.2)'};
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DifficultySelector = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const DifficultyOption = styled.button`
  flex: 1;
  padding: 12px 8px;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.selected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'};
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.selected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: var(--color-primary);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: var(--color-secondary);
      transform: translateY(-2px);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const colorOptions = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#06b6d4', '#ef4444', '#64748b',
  '#84cc16', '#f97316', '#3b82f6', '#14b8a6'
];

const iconOptions = [
  '🎯', '💪', '📚', '🧘', '🏃', '💧',
  '🥗', '😴', '🎵', '🎨', '💼', '🌱',
  '⏰', '🏋️', '🚶', '📝', '🎮', '📱',
  '🔥', '⭐', '🌟', '🎪', '🎭', '🎪'
];

const categories = [
  'health', 'fitness', 'productivity', 'mindfulness',
  'social', 'learning', 'creativity', 'nutrition', 'other'
];

const difficultyLevels = [
  { value: 1, label: 'Easy', points: 10 },
  { value: 2, label: 'Medium', points: 20 },
  { value: 3, label: 'Hard', points: 35 },
  { value: 4, label: 'Very Hard', points: 50 },
  { value: 5, label: 'Expert', points: 75 }
];

const CreateHabitModal = ({ isOpen, onClose, onSubmit, editingHabit = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    difficulty: 1,
    target_frequency: 1,
    color: '#6366f1',
    icon: '🎯',
    type: 'build'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        name: editingHabit.name || '',
        description: editingHabit.description || '',
        category: editingHabit.category || 'health',
        difficulty: editingHabit.difficulty || 1,
        target_frequency: editingHabit.target_frequency || 1,
        color: editingHabit.color || '#6366f1',
        icon: editingHabit.icon || '🎯',
        type: editingHabit.type || 'build'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'health',
        difficulty: 1,
        target_frequency: 1,
        color: '#6366f1',
        icon: '🎯',
        type: 'build'
      });
    }
    setErrors({});
  }, [editingHabit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    if (formData.name.length > 100) {
      newErrors.name = 'Habit name must be 100 characters or less';
    }
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(formData);
        onClose();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <Target size={24} />
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Habit Name</Label>
              <Input
                type="text"
                placeholder="Enter habit name..."
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                maxLength={100}
              />
              {errors.name && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
            </FormGroup>

            <FormGroup>
              <Label>Description (Optional)</Label>
              <TextArea
                placeholder="Describe your habit..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                maxLength={500}
              />
              {errors.description && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.description}</div>}
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="build">Build (Good habit to develop)</option>
                <option value="break">Break (Bad habit to stop)</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Zap size={16} />
                Difficulty Level
              </Label>
              <DifficultySelector>
                {difficultyLevels.map(level => (
                  <DifficultyOption
                    key={level.value}
                    type="button"
                    selected={formData.difficulty === level.value}
                    onClick={() => handleChange('difficulty', level.value)}
                  >
                    <div>{level.label}</div>
                    <div>{level.points} pts</div>
                  </DifficultyOption>
                ))}
              </DifficultySelector>
            </FormGroup>

            <FormGroup>
              <Label>
                <Calendar size={16} />
                Target Frequency (per day)
              </Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.target_frequency}
                onChange={(e) => handleChange('target_frequency', parseInt(e.target.value) || 1)}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Palette size={16} />
                Color
              </Label>
              <ColorPicker>
                {colorOptions.map(color => (
                  <ColorOption
                    key={color}
                    type="button"
                    color={color}
                    selected={formData.color === color}
                    onClick={() => handleChange('color', color)}
                  />
                ))}
              </ColorPicker>
            </FormGroup>

            <FormGroup>
              <Label>Icon</Label>
              <IconGrid>
                {iconOptions.map(icon => (
                  <IconOption
                    key={icon}
                    type="button"
                    selected={formData.icon === icon}
                    onClick={() => handleChange('icon', icon)}
                  >
                    {icon}
                  </IconOption>
                ))}
              </IconGrid>
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : (editingHabit ? 'Update Habit' : 'Create Habit')}
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateHabitModal;
