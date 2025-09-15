import { SlugifyPipe } from './slugify.pipe';

describe(SlugifyPipe.name, () => {
  const pipe = new SlugifyPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform text to slug format', () => {
    expect(pipe.transform('My Title')).toBe('my-title');
  });
});
