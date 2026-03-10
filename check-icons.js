const icons = [
  'logos:facebook', 'logos:twitter', 'logos:instagram-icon', 'logos:linkedin-icon',
  'logos:youtube-icon', 'logos:whatsapp-icon', 'logos:telegram', 'logos:discord-icon',
  'logos:tiktok-icon', 'logos:spotify-icon', 'logos:apple', 'logos:google-icon',
  'logos:microsoft-icon', 'logos:amazon', 'logos:netflix-icon', 'logos:github-icon',
  'logos:gitlab', 'logos:slack-icon', 'logos:figma', 'logos:notion-icon',
  'logos:reddit-icon', 'logos:pinterest', 'logos:twitch', 'logos:stripe',
  'logos:paypal', 'logos:bitcoin', 'logos:ethereum', 'logos:react',
  'logos:vue', 'logos:angular-icon', 'logos:nodejs-icon', 'logos:python',
  'logos:javascript', 'logos:typescript-icon', 'logos:html-5', 'logos:css-3',
  'logos:tailwindcss-icon', 'logos:firebase', 'logos:supabase-icon', 'logos:vercel-icon',
  'logos:aws', 'logos:docker-icon', 'logos:android-icon', 'logos:microsoft-windows-icon',
  'logos:linux-tux', 'logos:chrome', 'logos:firefox', 'logos:safari',
  'logos:trello', 'logos:jira', 'logos:zoom-icon', 'logos:google-meet',
  'logos:dropbox', 'logos:google-drive', 'logos:shopify', 'logos:wordpress-icon',
  'logos:medium-icon', 'logos:patreon', 'logos:stackoverflow-icon', 'logos:codepen-icon',
  'logos:framer', 'logos:canva', 'logos:adobe-icon', 'logos:adobe-photoshop',
  'logos:adobe-illustrator', 'logos:miro-icon', 'logos:postgresql', 'logos:mysql-icon',
  'logos:mongodb-icon', 'logos:redis', 'logos:graphql', 'logos:nextjs-icon',
  'logos:nuxtjs-icon', 'logos:svelte-icon', 'logos:vitejs', 'logos:webpack',
  'logos:babel', 'logos:jest', 'logos:cypress-icon', 'logos:playwright',
  'logos:storybook-icon', 'logos:npm-icon', 'logos:yarn', 'logos:pnpm',
  'logos:bun', 'logos:deno', 'logos:vim', 'logos:visual-studio-code',
  'logos:intellij-idea', 'logos:webstorm', 'logos:xcode', 'logos:postman-icon',
  'logos:insomnia', 'logos:swagger', 'logos:openai-icon', 'logos:hugging-face-icon',
  'logos:tensorflow', 'logos:pytorch-icon', 'logos:keras', 'logos:scikit-learn',
  'logos:pandas-icon', 'logos:numpy', 'logos:scipy', 'logos:matplotlib-icon',
  'logos:seaborn-icon', 'logos:plotly', 'logos:d3', 'logos:chartjs',
  'logos:threejs', 'logos:webgl', 'logos:opengl', 'logos:vulkan',
  'logos:unity', 'logos:unrealengine-icon', 'logos:godot-icon', 'logos:blender'
];

async function checkIcon(slug) {
  try {
    const url = `https://api.iconify.design/${slug.replace(':', '/')}.svg`;
    const res = await fetch(url);
    if (!res.ok) {
      return slug;
    }
    return null;
  } catch (e) {
    return slug;
  }
}

async function run() {
  const broken = [];
  for (const icon of icons) {
    const res = await checkIcon(icon);
    if (res) broken.push(res);
  }
  console.log('BROKEN:', broken.join(', '));
}

run();
