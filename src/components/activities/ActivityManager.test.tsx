import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProgressProvider } from '../../contexts/ProgressContext';
import { FamilyProgressProvider } from '../../contexts/FamilyProgressContext';
import { HUB_CURRENT_MEMBER_KEY } from '../../familyhub/hubFamilyMembers';
import { ToastProvider } from '../../contexts/ToastContext';
import ActivityManager from './ActivityManager';

// Mock the lazy-loaded components
vi.mock('./QuizActivity', () => ({
  default: ({ onComplete }: { onComplete: (score?: number) => void }) => (
    <div data-testid="quiz-activity">
      <button onClick={() => onComplete(85)} data-testid="complete-with-score">
        Complete with 85%
      </button>
      <button onClick={() => onComplete()} data-testid="complete-without-score">
        Complete without score
      </button>
    </div>
  ),
}));

vi.mock('./MazeActivity', () => ({
  default: ({ onComplete }: { onComplete: (score?: number) => void }) => (
    <div data-testid="maze-activity">
      <button onClick={() => onComplete(87.6)} data-testid="complete-decimal">
        Complete with decimal
      </button>
    </div>
  ),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <ProgressProvider>
      <FamilyProgressProvider>{children}</FamilyProgressProvider>
    </ProgressProvider>
  </ToastProvider>
);

describe('ActivityManager', () => {
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render activity instructions initially', () => {
    render(
      <Wrapper>
        <ActivityManager activityId="quiz" onClose={mockOnClose} onComplete={mockOnComplete} />
      </Wrapper>
    );

    expect(screen.getByText(/Privacy Quiz/i)).toBeInTheDocument();
  });

  it('should properly handle completion with score', async () => {
    const { getByText } = render(
      <Wrapper>
        <ActivityManager activityId="quiz" onClose={mockOnClose} onComplete={mockOnComplete} />
      </Wrapper>
    );

    // Click start button
    const startButton = getByText(/Start Activity/i);
    startButton.click();

    // Wait for activity to load and complete with score
    await waitFor(() => {
      const completeButton = screen.getByTestId('complete-with-score');
      completeButton.click();
    });

    // Verify onComplete was called with correct parameters
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('quiz', 85);
    });
  });

  it('should handle completion without score', async () => {
    const { getByText } = render(
      <Wrapper>
        <ActivityManager activityId="quiz" onClose={mockOnClose} onComplete={mockOnComplete} />
      </Wrapper>
    );

    // Click start button
    const startButton = getByText(/Start Activity/i);
    startButton.click();

    // Wait for activity to load and complete without score
    await waitFor(() => {
      const completeButton = screen.getByTestId('complete-without-score');
      completeButton.click();
    });

    // Verify onComplete was called with activityId and undefined score
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('quiz', undefined);
    });
  });

  it('should delegate progress persistence to the parent (no duplicate family record)', async () => {
    // Set a family member ID in localStorage
    localStorage.setItem(HUB_CURRENT_MEMBER_KEY, JSON.stringify(1));

    const { getByText } = render(
      <Wrapper>
        <ActivityManager activityId="quiz" onClose={mockOnClose} onComplete={mockOnComplete} />
      </Wrapper>
    );

    // Click start button
    const startButton = getByText(/Start Activity/i);
    startButton.click();

    // Complete activity with score
    await waitFor(() => {
      const completeButton = screen.getByTestId('complete-with-score');
      completeButton.click();
    });

    // Completion is reported upward — MissionShell records progress once
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('quiz', 85);
    });

    // ActivityManager itself must not write a duplicate family progress record
    const familyProgress = JSON.parse(localStorage.getItem('pandagarde_family_progress') || '{}');
    expect(familyProgress[1]).toBeUndefined();
  });

  it('rounds decimal scores before reporting completion', async () => {
    const { getByText } = render(
      <Wrapper>
        <ActivityManager activityId="maze" onClose={mockOnClose} onComplete={mockOnComplete} />
      </Wrapper>
    );

    getByText(/Start Activity/i).click();

    await waitFor(() => {
      screen.getByTestId('complete-decimal').click();
    });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('maze', 88);
    });
  });
});
