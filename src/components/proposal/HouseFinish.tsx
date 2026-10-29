// Coordinates follow the painted house, shared by both scene compositions.
// Static clipped brushwork adds material detail without another image or filter.
export function HouseFinish({ portrait }: { portrait: boolean }) {
  return <svg className="proposal-house-finish" viewBox={portrait ? "0 0 941 1672" : "0 0 1600 900"} preserveAspectRatio="none" aria-hidden="true">
    <defs>
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
      <g clipPath="url(#house-plaster-clip)">
        <path d="M440 460H880V820H440Z" fill="url(#house-wall-shade)" />
        <path d="M440 460H880V820H440Z" fill="url(#house-plaster-grain)" opacity=".65" />
        <path d="M654 638L874 654V676L668 657Z" fill="#273c42" opacity=".18" />
        <path d="M453 650L533 482L540 496L464 658Z" fill="#493c3e" opacity=".16" />
        <path d="M455 730l19 1m-13 5l8 1m352 48l17-1m-12 6h10M483 617l14 2" fill="none" stroke="#967b60" strokeWidth="2" opacity=".32" strokeLinecap="round" />
      </g>
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
