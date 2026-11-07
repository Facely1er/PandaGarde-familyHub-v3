import { fireEvent, render, screen } from '@testing-library/react';
import { StorySceneMedia } from './StorySceneMedia';

describe('StorySceneMedia', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
  });

  it('renders only the still when a scene has no clip', () => {
    render(<StorySceneMedia imageUrl="/images/story/01-PoInTheShadows.png" label="Po in the Shadows" />);

    expect(screen.getByRole('img', { name: 'Po in the Shadows' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play clip' })).not.toBeInTheDocument();
  });

  it('keeps the still until the clip is started', () => {
    render(
      <StorySceneMedia
        imageUrl="/images/story/3-TheAccident.png"
        videoUrl="/images/story/3-TheAccident.mp4"
        label="The Accident"
      />
    );

    expect(screen.getByRole('img', { name: 'The Accident' })).toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Play clip' }));

    const video = document.querySelector('video');
    expect(video).toBeTruthy();
    expect(video).toHaveAttribute('playsinline');
    expect(video?.muted).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(screen.queryByRole('img', { name: 'The Accident' })).not.toBeInTheDocument();
  });

  it('returns to the still when the clip cannot play', () => {
    render(
      <StorySceneMedia
        imageUrl="/images/story/3-TheAccident.png"
        videoUrl="/images/story/missing.mp4"
        label="The Accident"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Play clip' }));
    const video = document.querySelector('video');
    expect(video).toBeTruthy();
    fireEvent.error(video!);

    expect(screen.getByRole('img', { name: 'The Accident' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play clip' })).not.toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });
});
