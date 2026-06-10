/**
 * Tiny base class to allow future domain events without depending on a framework.
 */
export abstract class Entity<TProps> {
  protected readonly _id: string;
  protected props: TProps;

  constructor(id: string, props: TProps) {
    this._id = id;
    this.props = props;
  }
  get id() {
    return this._id;
  }
}
