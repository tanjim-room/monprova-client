

const SectionHeader = ({heading, subHeading}) => {
    return (
        <div className="my-16">
            <h2 className="text-center font-bold text-4xl primary-color leading-normal">{heading}</h2>
            <p className="font-bold text-center secondary-color border-y-2 w-1/2 mx-auto py-4 border-tertiary-color">{subHeading}</p>
        </div>
    );
};

export default SectionHeader;