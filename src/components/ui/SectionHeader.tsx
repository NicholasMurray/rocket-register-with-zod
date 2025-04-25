import { JSX } from "react";

type SectionHeaderProps = {
  title: string;
};

export const SectionHeader = ({ title }: SectionHeaderProps): JSX.Element => {
  return <h2 className="text-xl font-semibold mb-4">{title}</h2>;
};
