import { Component, Element, Listen, Prop } from '@stencil/core';
import { createThemedClasses, getElementClassMap, openURL } from '../../utils/theme';
import { CssClassMap } from '../../index';


@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss'
  }
})
export class Item {

  private childStyles: CssClassMap = {};

  @Element() private el: HTMLElement;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * If true, a detail arrow will appear on the item. Defaults to `false` unless the `mode`
   * is `ios` and an `href`, `onclick` or `button` property is present.
   */
  @Prop() detail: boolean;

  /**
   * If true, the user cannot interact with the item. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * Whether or not this item should be tappable.
   * If true, a button tag will be rendered. Defaults to `false`.
   */
  @Prop() button = false;

  @Prop() goBack = false;


  @Listen('ionStyle')
  itemStyle(ev: UIEvent) {
    ev.stopPropagation();

    const updatedStyles = ev.detail as any;
    const updatedKeys = Object.keys(ev.detail);
    const childStyles = {} as any;
    let hasStyleChange = false;
    for (const key of updatedKeys) {
      const itemKey = `item-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== this.childStyles[itemKey]) {
        hasStyleChange = true;
      }
      childStyles[itemKey] = newValue;
    }
    if (hasStyleChange) {
      this.childStyles = childStyles;
    }
  }

  componentDidLoad() {
    // Change the button size to small for each ion-button in the item
    // unless the size is explicitly set
    const buttons = this.el.querySelectorAll('ion-button');
    for (let i = 0; i < buttons.length; i++) {
      if (!buttons[i].size) {
        buttons[i].size = 'small';
      }
    }
  }

  render() {
    const clickable = !!(this.href || this.el.onclick || this.button);

    const TagType = clickable
      ? this.href ? 'a' : 'button'
      : 'div';

    const attrs = (TagType === 'button')
      ? {type: 'button'}
      : {href: this.href};

    const showDetail = this.detail != null ? this.detail : (this.mode === 'ios' && clickable);

    const themedClasses = {
      ...this.childStyles,
      ...createThemedClasses(this.mode, this.color, 'item'),
      ...getElementClassMap(this.el.classList),
      'item-disabled': this.disabled,
      'item-detail-push': showDetail,
    };

    return (
      <TagType
        {...attrs}
        class={themedClasses}
        onClick={(ev) => openURL(this.href, ev, this.goBack)}>
        <slot name='start'></slot>
        <div class='item-inner'>
          <div class='input-wrapper'>
            <slot></slot>
          </div>
          <slot name='end'></slot>
        </div>
        { clickable && this.mode === 'md' && <ion-ripple-effect useTapClick={true}/> }
      </TagType>
    );
  }

}
