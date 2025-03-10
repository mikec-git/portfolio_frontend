import React from 'react';
import PropTypes from 'prop-types';

import TitleMain from '../../../ATOMS/UI - A/TitleMain/TitleMain';
import TitleSecondary from '../../../ATOMS/UI - A/TitleSecondary/TitleSecondary';
import Bio from '../../../ATOMS/About -A/Bio/Bio';
import Skills from '../../../MOLECULES/About -M/Skills/Skills';
import ContactLinks from '../../../MOLECULES/About -M/ContactLinks/ContactLinks';

import c from './About.module.scss';

const about = (props) => {
  return (
    <section
      data-testid='aboutPage'
      ref={props.elementRef}
      className={c.About} >
      <div className={c.About__Text} >
        <div className={c.About__Title} >
          <TitleMain
            animating={props.animating}
            context='about'
            text='Hey there,'
            isNotSeparate />
          <TitleSecondary
            animating={props.animating}
            text='you must be looking for me!'
            context='about'
            isNotSeparate />
        </div>
        <Bio
          paragraphs={[
            [`I'm a `, {emphasis: true, phrase: `self-taught software developer`}, ` based out of Vancouver who loves all things coding.`],

            `I started my programming journey at Queen's University where I graduated with a bachelors in Engineering Physics. Upon stumbling across web development, I quickly fell in love with it.`,

            [`Currently, I'm a `, {emphasis: true, phrase: `full-stack developer @ Fortinet`}, `, and work with Python, Golang, and SQL (PostgreSQL) on a daily basis.`],

            `When my hands are off my keyboard, I enjoy lifting at the gym, snowboarding, and going to the beach!`
          ]}
          closing={[
            `I'm looking for a `,
            {emphasis: true, phrase: `full-time position`},
            ` in the `,
            {emphasis: true, phrase: `USA.`},
            ` New experiences are my thing, so I'm all ears for cool and challenging opportunities!`]} />
        <ContactLinks
          elementRef={props.contactLinksRef}
          images={props.images} />
      </div>
      <Skills images={props.images} />
    </section>
  );
}

about.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  contactLinksRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  animating: PropTypes.bool.isRequired,
  images: PropTypes.objectOf(PropTypes.object.isRequired).isRequired
}

export default about;