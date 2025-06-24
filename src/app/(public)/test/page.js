export default function Testpage(){
    return      <div className="flex flex-col relative min-h-[256px] p-5 bg-white">
      <button className="hidden lg:hidden md:flex sm:flex flex-col relative mt-5 appearance-none bg-black text-white rounded text-center cursor-pointer py-[15px] px-[25px]">
        Click me!
      </button>
      <section className="flex flex-col relative min-h-[256px] p-5 w-full self-stretch flex-grow max-w-[1200px] mx-auto">
        <div className="relative mt-5 h-auto text-center">EXAMPLE TEXT</div>
        <button className="flex flex-col relative appearance-none bg-black text-white rounded cursor-pointer my-5 mx-auto py-[15px] px-[25px] lg:text-center lg:mx-auto">
          Click me!
        </button>
      </section>
    </div>
}