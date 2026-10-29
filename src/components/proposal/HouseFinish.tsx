// Coordinates follow the painted house, shared by both scene compositions.
// Static clipped brushwork adds material detail without another image or filter.
export function HouseFinish({ portrait }: { portrait: boolean }) {
  return <svg className="proposal-house-finish" viewBox={portrait ? "0 0 941 1672" : "0 0 1600 900"} preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <radialGradient id="house-contact"><stop stopColor="#0a2228" stopOpacity=".3" /><stop offset="1" stopColor="#0a2228" stopOpacity="0" /></radialGradient>
      <radialGradient id="house-warm-spill"><stop stopColor="#ffcf83" stopOpacity=".25" /><stop offset=".5" stopColor="#ffce80" stopOpacity=".1" /><stop offset="1" stopColor="#ffce80" stopOpacity="0" /></radialGradient>
      <linearGradient id="house-roof-rim" x1="0" y1="1" x2=".8" y2="0"><stop stopColor="#9dcbe5" stopOpacity="0" /><stop offset=".65" stopColor="#aacfe6" stopOpacity=".22" /><stop offset="1" stopColor="#d2e5f0" stopOpacity=".38" /></linearGradient>
      <pattern id="house-plaster-grain" width="43" height="37" patternUnits="userSpaceOnUse">
        <path d="M3 9l6-1m15 14l9 1M12 31l3-1m20-26h2" stroke="#846b57" strokeWidth="1.4" opacity=".20" />
        <path d="M6 17l9 1m14 14l4-1" stroke="#fff2d1" strokeWidth="1.7" opacity=".28" />
      </pattern>
      <clipPath id="house-plaster-clip">
        <path clipRule="evenodd" fillRule="evenodd" d="M445 645L535 466Q596 588 680 635L872 654V810H445Z M523 597V554Q524 512 550 522Q574 526 574 554V596Z M501 808V704Q502 638 558 638Q615 640 616 705V808Z M721 766V676H852V766Z M581 580H626L717 810H639Z" />
      </clipPath>
      <clipPath id="house-door-clip"><path d="M523 806V708Q524 664 558 664Q592 666 594 708V806Z" /></clipPath>
      <linearGradient id="house-wall-shade" x1="0" y1="0" x2="1" y2=".4">
        <stop stopColor="#f8d397" stopOpacity=".05" /><stop offset="1" stopColor="#294558" stopOpacity=".22" />
      </linearGradient>
    </defs>
    <g transform={portrait ? undefined : "translate(706.7 -117.4) scale(.85 .8)"}>
      <ellipse cx="669" cy="841" rx="249" ry="30" fill="url(#house-contact)" />
      <g className="house-light-spill">
        <ellipse className="house-spill-upper" cx="534" cy="872" rx="125" ry="64" fill="url(#house-warm-spill)" transform="rotate(-19 534 872)" />
        <ellipse className="house-spill-lower" cx="786" cy="865" rx="155" ry="54" fill="url(#house-warm-spill)" />
      </g>
      <g clipPath="url(#house-plaster-clip)">
        <path d="M440 460H880V820H440Z" fill="url(#house-wall-shade)" />
        <path d="M440 460H880V820H440Z" fill="url(#house-plaster-grain)" opacity=".65" />
        <path d="M654 638L874 654V676L668 657Z" fill="#273c42" opacity=".18" />
        <path d="M453 650L533 482L540 496L464 658Z" fill="#493c3e" opacity=".16" />
        <path d="M455 730l19 1m-13 5l8 1m352 48l17-1m-12 6h10M483 617l14 2" fill="none" stroke="#967b60" strokeWidth="2" opacity=".32" strokeLinecap="round" />
      </g>
      <path d="M407 629Q479 564 518 438Q525 416 541 425Q618 455 711 472" fill="none" stroke="url(#house-roof-rim)" strokeWidth="5" strokeLinecap="round" className="house-roof-rim" />
      <g className="house-front-grass" fill="#345c44">
        <path d="M428 848Q417 825 405 822Q409 841 416 850Q398 835 391 840L407 858Q422 860 439 853Q443 829 455 820Q437 826 428 848Z" />
        <path d="M636 852Q624 831 614 832L623 855Q607 848 600 851L615 862Q637 862 652 854Q648 834 658 822Q637 836 636 852Z" />
        <path d="M853 847Q839 825 830 824L840 850L823 840L830 855Q850 861 870 851Q870 837 882 823Q865 830 860 845L857 828Z" />
        <path d="M684 842Q674 825 682 814Q695 809 704 818Q704 805 716 806Q728 809 729 821Q744 815 750 827Q755 838 740 847Z" />
      </g>
      <g fill="none" stroke="#789469" strokeWidth="2" opacity=".5"><path d="M424 853l-7-17m219 21l4-17m213 13l-8-15m-150-5q10-9 17-6" /></g>
      <HouseLantern />
      <HouseMailbox />
      <HouseChimes />
      <g clipPath="url(#house-door-clip)" fill="none" strokeLinecap="round">
        <path d="M532 686Q538 716 533 745T535 800M548 672Q542 705 549 732T546 792M566 678Q572 717 567 751T569 801M584 690Q578 718 584 745T581 794" stroke="#4c302b" strokeWidth="1.5" opacity=".45" />
        <path d="M537 702Q539 721 537 733M553 754Q550 778 553 797M574 687Q577 709 574 722" stroke="#e3ac72" strokeWidth="1.2" opacity=".38" />
        <path d="M544 762q-5 8 0 15q5-8 0-15M579 714q-4 6 0 12q4-6 0-12" stroke="#4c302b" strokeWidth="1.3" opacity=".4" />
      </g>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M548 435l18 7m44 10l20 6m42 9l19 5M567 481l13 5m47 9l17 5m-36 39l12 5m49 10l15 4M654 582l18 8m42 8l12 3m53 18l16 3" stroke="#d3929f" strokeWidth="2" opacity=".25" />
        <path d="M678 641Q778 657 887 650" stroke="#372e3b" strokeWidth="3" opacity=".38" />
        <path d="M468 830l98 5m-81-25l29 1m30 1l35 1" stroke="#f2dfba" strokeWidth="2" opacity=".45" />
        <path d="M718 451l20-2v-17m-18 45l14-1m11 28l24 2" stroke="#8d7967" strokeWidth="1.5" opacity=".35" />
      </g>
    </g>
  </svg>;
}

function HouseLantern() {
  return <g>
    <path d="M476 670V660Q482 650 486 660V666" fill="none" stroke="#514438" strokeWidth="3" />
    <g className="house-lantern" stroke="#514438" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M477 666L463 678H491Z" fill="#64513b" />
      <path d="M466 678L469 701H487L490 678Z" fill="#ffd483" />
      <path d="M478 678V701M467 703H489" fill="none" />
      <path d="M474 683V696" stroke="#fff0b6" strokeWidth="3" />
    </g>
  </g>;
}

function HouseMailbox() {
  return <svg x="365" y="767" width="66" height="102" viewBox="0 0 66 102" className="house-mailbox">
    <path d="M30 37L33 99H40L38 37" fill="#80654d" stroke="#4d4b3e" strokeWidth="2" />
    <path d="M6 41V21Q6 7 20 7H48Q60 7 60 21V41Z" fill="#6c8980" stroke="#344e49" strokeWidth="2.5" />
    <path d="M7 21Q8 7 20 7Q33 7 33 21V41H7Z" fill="#8ba296" stroke="#344e49" strokeWidth="2" />
    <path d="M16 23H25M44 30V9H55V17H44" fill="none" stroke="#d3ae78" strokeWidth="3" strokeLinecap="round" />
    <path d="M35 49L36 83M10 36H28" stroke="#c4c3a0" opacity=".4" />
  </svg>;
}

function HouseChimes() {
  return <svg x="688" y="645" width="37" height="104" viewBox="0 0 37 104" className="house-chimes">
    <path d="M18 0V14" stroke="#bba780" strokeWidth="1.5" />
    <g className="house-chime-sway">
      <path d="M3 22Q18 7 33 22Z" fill="#8e7459" stroke="#514c40" strokeWidth="2" />
      <g stroke="#c3bba0" strokeWidth="1"><path d="M8 22V39M18 22V35M28 22V43M18 66V82" /></g>
      <g fill="#b8b5a0" stroke="#666e63" strokeWidth="1.5"><rect x="5" y="39" width="5" height="24" rx="2" /><rect x="16" y="35" width="5" height="30" rx="2" /><rect x="26" y="43" width="5" height="23" rx="2" /></g>
      <path d="M18 79L25 88L18 99L12 88Z" fill="#72918a" stroke="#4b6c65" strokeWidth="1.5" />
    </g>
  </svg>;
}
